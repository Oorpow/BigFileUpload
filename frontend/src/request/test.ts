import request from "."

export const uploadAxios = (formData: any) => request({
    method: 'post',
    url: '/upload',
    data: formData
})

export const mergeAxios = (data: any) => {
    console.log('mergeaxios');
    return request({
        method: 'post',
        url: '/merge',
        data
    })
}