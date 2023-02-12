<template>
	<input type="file" ref="inputRef" @change="selectFile" />
	<button id="upload" ref="uploadRef" @click="upload">上传</button>

	<div style="width: 300px" id="progress">上传进度</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { mergeAxios, uploadAxios } from '@/request/test'

let inputRef = ref()
let uploadRef = ref()
let files: any = {} // 文件对象
let sliceList: any[] = [] // 切片数组

// 读取文件内容
function selectFile(e: any) {
	files = e.target.files[0]
	// 创建切片，得到一个切片数组
	sliceList = createSlice(files)
}

/**
 * 创建切片
 * @param {*} file 大文件
 * @param {*} size 每个切片的大小
 */
function createSlice(file: any, size = 2 * 1024 * 1024) {
	const sliceList = []
	let cur = 0
	// 假设当前file.size是8m，那么切出来的切片共有4块，分别是[0, 2], [2, 4], [4, 6], [6, 8]
	while (cur < file.size) {
		sliceList.push({
			file: file.slice(cur, cur + size),
		})
		cur += size
	}
	return sliceList
}

/**
 * 将每个切片使用formData包装，传输给服务器解析
 * @param sliceList 切片数组
 */
async function uploadFile(sliceList: any[]) {
	// 数据处理。需要将切片的数据进行维护成一个包括该文件，文件名，切片名的对象，所以采用FormData对象来进行整理数据
	const reqList = sliceList
		.map(({ file, fileName, index, chunkName }) => {
			const formData = new FormData() //创建表单类型数据
			formData.append('file', file)
			formData.append('fileName', fileName)
			formData.append('chunkName', chunkName)
			return {
				formData,
				index,
			}
		})
		.map(({ formData, index }) => {
			return uploadAxios(formData)
		})

	// 并发请求。每一个切片都分别作为一个请求，只有当这4个切片都传输给后端了，即四个请求都成功发起，才上传成功
	Promise.all(reqList).then((res) => {
		console.log(res)
		// 通知后端合并切片
		mergeAxios({
			size: files.size,
			filename: files.name,
		})
	})
}

// 文件上传
function upload() {
	// 处理切片数组，转成一个切片对象数组
	const uploadList = sliceList.map(({ file }, index) => {
		return {
			file,
			size: file.size,
			percent: 0,
			chunkName: `${files.name}-${index}`,
			fileName: files.name,
			index,
		}
	})
	uploadFile(uploadList)
}
</script>

<style scoped></style>
