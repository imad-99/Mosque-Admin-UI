<script lang="ts">
import AddDjanazahDrawer from '@/views/pages/djanazah/add-djanazah-drawer.vue';
import DjanazahDrawerEmit from '@/views/pages/djanazah/djanazah-drawer-emit';
import PaginationComponent from '@/views/shared/pagination-component';
import { Prayer } from '@/views/shared/prayer';
import TableFilter from '@/views/shared/table-filter';
import TableHeader from '@/views/shared/table-header';
import DjanazahController from '@api/controller/djanazah/djanazah-controller';
import { AxiosError, AxiosResponse } from 'axios';
import { Component, toNative } from 'vue-facing-decorator';
import { VDataTableServer } from 'vuetify/labs/VDataTable';

@Component({
  components: {
    VDataTableServer,
    AddDjanazahDrawer
  }
})
class DjanazahPage extends PaginationComponent {
  // state
  viewDjanazahDrawer: boolean = false
  viewDeleteDialog: boolean = false
  documentIdToDelete: string = ""
  entryIdToDelete: string = ""
  nameToDelete: string = ""
  tableHeaders: TableHeader[] = [
    { title: 'Naam', key: 'name', sortable: false },
    { title: 'Datum', key: 'documentId', sortable: false },
    { title: 'Na', key: 'after', sortable: false },
    { title: 'Foto', key: 'photo', sortable: false },
    { title: 'Acties', key: 'actions', sortable: false }
  ]

  // output props (DjanazahDrawer)
  id: string | undefined
  fullName: string | undefined
  date: string | undefined
  after: Prayer | undefined   
  photo: string | undefined

  // non-state
  djanazahController: DjanazahController = new DjanazahController();

  // methods
  private fetchDjanazah(page: number, itemsPerPage: number) {
    this.isLoading = true
    const filters: Map<string, Object> = new Map<string, Object>()
    filters.set('type', 'DJANAZAH')
    filters.set('page', page)
    filters.set('itemsPerPage', itemsPerPage)

    this.djanazahController.fetchDjanazah(filters)
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
    this.fetchDjanazah(tableFilter.page, tableFilter.itemsPerPage)
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

  public deleteDjanazah(): void {
    this.viewDeleteDialog = false
    this.isLoading = true
    this.djanazahController.deleteDjanazah(this.documentIdToDelete, this.entryIdToDelete)
    .then(() => {
      this.fetchDjanazah(this.tableFilter.page, this.tableFilter.itemsPerPage)
    })
    .catch((error: AxiosError) => {
      console.log(error)
      this.isLoading = false
    })
  }

  public showDjanazahDrawer(id?: string, fullName?: string, date?: string, after?: Prayer, photo?: string) {
    this.id = id
    this.fullName = fullName
    this.date = date
    this.after = after
    this.photo = photo
    this.viewDjanazahDrawer = true
  }
  
  public handleDrawerEvent(value: DjanazahDrawerEmit) {
    this.viewDjanazahDrawer = value.visible
    if (value.reload) {
      this.fetchDjanazah(this.tableFilter.page, this.tableFilter.itemsPerPage) 
    }
  }
}

export default toNative(DjanazahPage)
</script>

<template>
  <section>
    <VRow>
      <VCol cols="12">
        <VCard title="Djanazah">
          <VCardText class="d-flex flex-wrap py-4 gap-4">
            <VBtn prepend-icon="tabler-plus" @click="showDjanazahDrawer()">Nieuw djanazah gebed </VBtn>
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
            <template #item.photo="{ item }">
              <span class="text-capitalize font-weight-medium">{{ item.props.title.photo }}</span>
            </template>
            <template #item.actions="{ item }">
              <IconBtn @click="showDeleteDialog(item.props.title.documentId, item.props.title.id, item.props.title.name)">
                <VIcon icon="tabler-trash" />
              </IconBtn>
              <IconBtn @click="showDjanazahDrawer(item.props.title.id, item.props.title.name, item.props.title.documentId, item.props.title.after, item.props.title.photo)">
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
          <VBtn color="warning" @click="deleteDjanazah()">Verwijder</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
    <AddDjanazahDrawer 
      :isDrawerOpen="viewDjanazahDrawer" 
      :inputId="id"
      :inputFullName="fullName" 
      :inputDate="date"
      :inputAfter="after"
      :inputPhoto="photo"
      @djanazahDrawer="handleDrawerEvent"/>
  </section>
</template>