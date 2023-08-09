import Prayer from "../../shared/prayer";

export default interface DjanazahView {
    documentId: string,
    id: string,
    name: string,
    after: Prayer,
    photo: string,
}