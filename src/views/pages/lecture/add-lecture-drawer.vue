<script lang="ts">
import { Prayer } from '@/views/shared/prayer';
import LectureController from '@api/controller/lecture/lecture-controller';
import { AxiosError } from 'axios';
import { Component, Prop, Vue, Watch } from 'vue-facing-decorator';
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';
import LectureDrawerEmit from './lecture-drawer-emit';

@Component({
    components: {
        PerfectScrollbar
    },
    emits: ['lectureDrawer']
})
export default class AddLectureDrawer extends Vue {

    // state
    @Prop() 
    isDrawerOpen: boolean = false
    @Prop() 
    inputId: string = ""
    @Prop() 
    inputName: string = ""
    @Prop() 
    inputDate: string = ""
    @Prop() 
    inputAfter: Prayer = Prayer.DOHR;
    @Prop() 
    inputLecturer: string = ""
    @Prop() 
    inputDuration: string = ""

    readonly prayers: string[] = Object.values(Prayer)
    isFormValid: boolean = false
    id: string = ""
    name: string = ""
    date: string = ""
    oldDate: string = ""
    after: Prayer = Prayer.DOHR;
    lecturer: string = ""
    duration: string = ""

    // non-state
    lectureController: LectureController = new LectureController();

    // watchers
    @Watch("inputId")
    idWatcher(newValue: string) {
        this.id = newValue ? newValue : ""
    }

    @Watch("inputName")
    nameWatcher(newValue: string) {
        this.name = newValue ? newValue : ""
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

    @Watch("inputLecturer")
    lecturerWatcher(newValue: string) {
        this.lecturer = newValue ? newValue : ""
    }

    @Watch("inputPhoto")
    durationWatcher(newValue: string) {
        this.duration = newValue ? newValue : ""
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
                this.addLecture()
            }
        })
    }

    private addLecture(): void {
        this.lectureController.addLecture(this.name, this.date, this.after, this.lecturer, this.duration, this.id, this.oldDate)
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

    private emitDrawerValue(emit: LectureDrawerEmit): void {
        this.$emit('lectureDrawer', emit)
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

        <AppDrawerHeaderSection title="Nieuwe lezing" @cancel="cancelDrawer(false)"/>

        <PerfectScrollbar :options="{ wheelPropagation: false }">
            <VCard flat>
                <VCardText>
                    <VForm v-model="isFormValid" @submit.prevent="onSubmit()" ref="form">
                        <VRow>
                            <VCol cols="12">
                                <AppTextField :rules="[defaultValidator]" label="Volledige naam*" v-model="name"/>
                            </VCol>
                            <VCol cols="12">
                                <AppDateTimePicker :rules="[defaultValidator]" label="Datum*" v-model="date"/>
                            </VCol>
                            <VCol cols="12">
                                <AppSelect :rules="[defaultValidator]" label="Na*" :items="prayers" v-model="after"/>
                            </VCol>
                            <VCol cols="12">
                                <AppTextField :rules="[defaultValidator]" label="Docent*" v-model="lecturer"/>
                            </VCol>
                            <VCol cols="12">
                                <AppTextField :rules="[defaultValidator]" label="Duur*" v-model="duration"/>
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
