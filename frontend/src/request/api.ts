import type { AxiosPromise } from 'axios'
import request from './index'
type ApiResponse<T> = {
    status: number
    message?: string
    data: T
}

type TestRes = {
    id: string
    name: string
    title: string
}

export const Login = () => request.get('/auth')

export const mockTest = (): AxiosPromise<TestRes[]> => request({
    url: '/api/test'
})
export const mockTest2 = (): Promise<ApiResponse<TestRes[]>> => request({
    url: '/api/test'
})