<script lang="ts">
import { Prayer } from '@/views/shared/prayer';
import DjanazahController from '@api/controller/djanazah/djanazah-controller';
import { AxiosError } from 'axios';
import { Component, Prop, Vue, Watch } from 'vue-facing-decorator';
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';
import DjanazahDrawerEmit from './djanazah-drawer-emit';

@Component({
    components: {
        PerfectScrollbar
    },
    emits: ['djanazahDrawer']
})
export default class AddDjanazahDrawer extends Vue {

    // state
    @Prop() 
    isDrawerOpen: boolean = false
    @Prop() 
    inputId: string = ""
    @Prop() 
    inputFullName: string = ""
    @Prop() 
    inputDate: string = ""
    @Prop() 
    inputAfter: Prayer = Prayer.DOHR;
    @Prop() 
    inputPhoto: string = ""

    readonly prayers: string[] = Object.values(Prayer)
    isFormValid: boolean = false
    id: string = ""
    fullName: string = ""
    date: string = ""
    oldDate: string = ""
    after: Prayer = Prayer.DOHR;
    photo: string = ""

    // non-state
    djanazahController: DjanazahController = new DjanazahController();

    // watchers
    @Watch("inputId")
    idWatcher(newValue: string) {
        this.id = newValue ? newValue : ""
    }

    @Watch("inputFullName")
    fullNameWatcher(newValue: string) {
        this.fullName = newValue ? newValue : ""
    }

    @Watch("inputDate")
    dateWatcher(newValue: string) {
        if (newValue) {
            this.date = newValue
            this.oldDate = newValue
        } else {
            this.date = ""
            this.oldDate = ""
        }
    }

    @Watch("inputAfter")
    afterWatcher(newValue: Prayer) {
        this.after = newValue ? newValue : Prayer.DOHR
    }

    @Watch("inputPhoto")
    photoWatcher(newValue: string) {
        this.photo = newValue ? newValue : ""
    }

    public defaultValidator(value: string): true | string {
        if (!value) {
            return "Dit is een verplicht veld"
        }
        return true
    }

    public onSubmit(): void {
        this.$refs.form.validate().then(({valid}: {valid: boolean}) => {
            if (valid) {
                this.addDjanazah()
            }
        })
    }

    private addDjanazah(): void {
        this.djanazahController.addDjanazah(this.fullName, this.date, this.after, this.photo, this.id, this.oldDate)
        .then(() => {
            this.emitDrawerValue({ visible: false, reload: true })
        })
        .catch((error: AxiosError) => {
            alert(error.message)
        })
    }

    public cancelDrawer(value: boolean): void {
        this.emitDrawerValue({ visible: value, reload: false })
    }

    private emitDrawerValue(emit: DjanazahDrawerEmit): void {
        this.$emit('djanazahDrawer', emit)
    }
}

</script>

<template>
    <VNavigationDrawer
        temporary
        width="400"
        location="end"
        class="scrollabe-content"
        :model-value="isDrawerOpen"
        @update:model-value="cancelDrawer">

        <AppDrawerHeaderSection :title="id ? 'Djanazah bijwerken' : 'Nieuw djanazah gebed'" @cancel="cancelDrawer(false)"/>

        <PerfectScrollbar :options="{ wheelPropagation: false }">
            <VCard flat>
                <VCardText>
                    <VForm v-model="isFormValid" @submit.prevent="onSubmit()" ref="form">
                        <VRow>
                            <VCol cols="12">
                                <AppTextField :rules="[defaultValidator]" label="Volledige naam*" v-model="fullName"/>
                            </VCol>
                            <VCol cols="12">
                                <AppDateTimePicker :rules="[defaultValidator]" label="Datum*" v-model="date"/>
                            </VCol>
                            <VCol cols="12">
                                <AppSelect :rules="[defaultValidator]" label="Na*" :items="prayers" v-model="after"/>
                            </VCol>
                            <VCol cols="12">
                                <AppTextField :rules="[defaultValidator]" label="Link naar foto*" v-model="photo"/>
                            </VCol>
                            <VCol cols="12">
                                <VBtn type="submit">Opslaan</VBtn>
                            </VCol>
                        </VRow>
                    </VForm>
                </VCardText>
            </VCard>
        </PerfectScrollbar>

    </VNavigationDrawer>
</template>
