import axiosIns from "@/plugins/axios";
import { EventType } from "@/views/shared/event-type";
import { Prayer } from "@/views/shared/prayer";
import { AxiosResponse } from "axios";
import QueryParams from "../shared/QueryParams";
import AddDocument from "../shared/add-document";

export default class LectureController extends QueryParams {

    fetchLecture(filters: Map<string, Object>): Promise<AxiosResponse> {
        const queryParams: string = this.createQueryParams(filters)
        return new Promise<AxiosResponse>((resolve, reject) => {
            axiosIns.get(import.meta.env.VITE_APP_API_FIRESTORE_COLLECTION_PATH + "/" + import.meta.env.VITE_APP_FIRESTORE_EVENTS + queryParams)
            .then((response) => {
                resolve(response)
            })
            .catch((error) => {
                reject(error)
            })
        })
    }

    deleteLecture(documentId: string, entryId: string): Promise<AxiosResponse> {
        return new Promise<AxiosResponse>((resolve, reject) => {
            axiosIns.delete(import.meta.env.VITE_APP_API_FIRESTORE_COLLECTION_PATH + "/" + import.meta.env.VITE_APP_FIRESTORE_EVENTS + "/" + documentId + "/" + entryId)
            .then((response) => {
                resolve(response)
            })
            .catch((error) => {
                reject(error)
            })
        })
    }

    addLecture(name: string, date: string, after: Prayer, lecturer: string, duration: string, id?: string, oldDate?: string): Promise<AxiosResponse> {
        const data: { [key: string]: Object | undefined; } = { id: id, name: name, oldDate: oldDate, after: after, lecturer: lecturer, duration: duration, type: EventType.LECTURE }
        const addDocument: AddDocument = { data: data, eventType: EventType.LECTURE }

        return new Promise<AxiosResponse>((resolve, reject) => {
            axiosIns.post(import.meta.env.VITE_APP_API_FIRESTORE_COLLECTION_PATH + "/" + import.meta.env.VITE_APP_FIRESTORE_EVENTS + "/" + date, addDocument)
            .then((response) => {
                resolve(response)
            })
            .catch((error) => {
                reject(error)
            })
        })
    }
}