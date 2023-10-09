<script lang="ts">
import AddLectureDrawer from '@/views/pages/lecture/add-lecture-drawer.vue';
import LectureDrawerEmit from '@/views/pages/lecture/lecture-drawer-emit';
import { EventType } from '@/views/shared/event-type';
import PaginationComponent from '@/views/shared/pagination-component';
import { Prayer } from '@/views/shared/prayer';
import TableFilter from '@/views/shared/table-filter';
import TableHeader from '@/views/shared/table-header';
import LectureController from '@api/controller/lecture/lecture-controller';
import { AxiosError, AxiosResponse } from 'axios';
import { Component, toNative } from 'vue-facing-decorator';
import { VDataTableServer } from 'vuetify/labs/VDataTable';

@Component({
  components: {
    VDataTableServer,
    AddLectureDrawer
  }
})
class LecturePage extends PaginationComponent {
  // state
  viewLectureDrawer: boolean = false
  viewDeleteDialog: boolean = false
  documentIdToDelete: string = ""
  entryIdToDelete: string = ""
  nameToDelete: string = ""
  tableHeaders: TableHeader[] = [
    { title: 'Naam', key: 'name', sortable: false },
    { title: 'Datum', key: 'documentId', sortable: false },
    { title: 'Na', key: 'after', sortable: false },
    { title: 'Docent', key: 'lecturer', sortable: false },
    { title: 'Duur (minuten)', key: 'duration', sortable: false },
    { title: 'Acties', key: 'actions', sortable: false }
  ]

  // output props (LectureDrawer)
  id: string | undefined
  name: string | undefined
  date: string | undefined
  after: Prayer | undefined   
  lecturer: string | undefined
  duration: string | undefined

  // non-state
  lectureController: LectureController = new LectureController();

  // methods
  private fetchLecture(page: number, itemsPerPage: number) {
    this.isLoading = true
    const filters: Map<string, Object> = new Map<string, Object>()
    filters.set('type', EventType.LECTURE)
    filters.set('page', page)
    filters.set('itemsPerPage', itemsPerPage)

    this.lectureController.fetchLecture(filters)
    .then((response: AxiosResponse) => {
      this.tableFilter = { page: response.data.currentPage, itemsPerPage: response.data.itemsPerPage }
      this.totalItems = response.data.totalItems
      this.items = response.data.items
      this.isLoading = false
    })
    .catch(() => {
      this.isLoading = false
    })
  }

  public refreshTable(tableFilter: TableFilter) {
    this.fetchLecture(tableFilter.page, tableFilter.itemsPerPage)
  }

  public showDeleteDialog(documentId: string, entryId: string, name: string) {
    this.documentIdToDelete = documentId
    this.entryIdToDelete = entryId
    this.nameToDelete = name
    this.viewDeleteDialog = true
  }

  public hideDeleteDialog() {
    this.viewDeleteDialog = false
  }

  public deleteLecture(): void {
    this.viewDeleteDialog = false
    this.isLoading = true
    this.lectureController.deleteLecture(this.documentIdToDelete, this.entryIdToDelete)
    .then(() => {
      this.fetchLecture(this.tableFilter.page, this.tableFilter.itemsPerPage)
    })
    .catch((error: AxiosError) => {
      console.log(error)
      this.isLoading = false
    })
  }

  public showLectureDrawer(id?: string, name?: string, date?: string, after?: Prayer, lecturer?: string, duration?: string) {
    this.id = id
    this.name = name
    this.date = date
    this.after = after
    this.lecturer = lecturer
    this.duration = duration;
    this.viewLectureDrawer = true
  }
  
  public handleDrawerEvent(value: LectureDrawerEmit) {
    this.viewLectureDrawer = value.visible
    if (value.reload) {
      this.fetchLecture(this.tableFilter.page, this.tableFilter.itemsPerPage) 
    }
  }
}

export default toNative(LecturePage)
</script>

<template>
  <section>
    <VRow>
      <VCol cols="12">
        <VCard title="Lezingen">
          <VCardText class="d-flex flex-wrap py-4 gap-4">
            <VBtn prepend-icon="tabler-plus" @click="showLectureDrawer()">Nieuwe lezing</VBtn>
          </VCardText>
          <VDataTableServer
              :items-per-page="tableFilter.itemsPerPage"
              :page="tableFilter.page"
              :items="items"
              :items-length="totalItems"
              :headers="tableHeaders"
              :loading="isLoading"
              @update:options="refreshTable"
              class="text-no-wrap">
            <template #item.name="{ item }">
              <span class="text-capitalize font-weight-medium">{{ item.props.title.name }}</span>
            </template>
            <template #item.documentId="{ item }">
              <span class="text-capitalize font-weight-medium">{{ item.props.title.documentId }}</span>
            </template>
            <template #item.after="{ item }">
              <span class="text-capitalize font-weight-medium">{{ item.props.title.after }}</span>
            </template>
            <template #item.lecturer="{ item }">
              <span class="text-capitalize font-weight-medium">{{ item.props.title.lecturer }}</span>
            </template>
            <template #item.duration="{ item }">
              <span class="text-capitalize font-weight-medium">{{ item.props.title.duration }}</span>
            </template>
            <template #item.actions="{ item }">
              <IconBtn @click="showDeleteDialog(item.props.title.documentId, item.props.title.id, item.props.title.name)">
                <VIcon icon="tabler-trash" />
              </IconBtn>
              <IconBtn @click="showLectureDrawer(item.props.title.id, item.props.title.name, item.props.title.documentId, item.props.title.after, item.props.title.lecturer, item.props.title.duration)">
                <VIcon icon="tabler-edit" />
              </IconBtn>
            </template>
          </VDataTableServer>
        </VCard>
      </VCol>
    </VRow>
    <VDialog v-model="viewDeleteDialog" width="auto">
      <VCard>
        <VCardText>
          Weet je zeker dat je {{ nameToDelete }} wilt verwijderen?
        </VCardText>
        <VCardActions class="d-flex justify-space-between">
          <VBtn color="light" @click="hideDeleteDialog()">Annuleren</VBtn>
          <VBtn color="warning" @click="deleteLecture()">Verwijder</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
    <AddLectureDrawer 
      :isDrawerOpen="viewLectureDrawer" 
      :inputId="id"
      :inputName="name" 
      :inputDate="date"
      :inputAfter="after"
      :inputLecturer="lecturer"
      :inputDuration="duration"
      @lectureDrawer="handleDrawerEvent"/>
  </section>
</template>