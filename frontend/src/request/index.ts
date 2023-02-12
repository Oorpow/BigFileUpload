import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'

enum RequestEnums {
  TIMEOUT = 20000, // 请求超时
  FAILED = 400, // 请求失败
  SUCCESS = 200
}

// mock地址
const URL: string = 'http://localhost:5005'

const config = {
  baseURL: URL,
  timeout: RequestEnums.TIMEOUT
}

class RequestHttp {
  service: AxiosInstance
  constructor(config: AxiosRequestConfig) {
    // 实例化axios
    this.service = axios.create(config)

    // 请求拦截器
    this.service.interceptors.request.use(
      (config: AxiosRequestConfig) => {
        const token = localStorage.getItem('token') || 'token123'
        return {
          ...config,
          headers: {
            Authorization: token
          }
        }
      },
      (error: AxiosError) => {
        Promise.reject(error)
      }
    )

    // 响应拦截器
    this.service.interceptors.response.use(
      (res: AxiosResponse) => {
        const { data, config } = res

        // 全局错误信息拦截
        if (data.code && data.code !== RequestEnums.SUCCESS) {
          // 此处可以用某些组件的message来提示
          return Promise.reject(data)
        }
        return data
      },
      (error: AxiosError) => {
        const { response } = error
        if (response) {
          this.handleCode(response.status)
        }
        // 断网
        if (!window.navigator.onLine) {
          // 可以跳到错误页，也可不处理
        }
      }
    )
  }
  //   处理状态码
  handleCode(code: number) {
    // 根据状态码进行信息提示
    switch (code) {
      case 401:
        break

      default:
        // 请求失败
        break
    }
  }
}

export default new RequestHttp(config).service
