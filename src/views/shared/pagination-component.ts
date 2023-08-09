import { Vue } from "vue-facing-decorator";
import TableFilter from "./table-filter";

export default class PaginationComponent extends Vue {
    isLoading: boolean = false
    tableFilter: TableFilter = { page: 1, itemsPerPage: 10 }
    totalItems: number = 0
    items: any[] = []
}