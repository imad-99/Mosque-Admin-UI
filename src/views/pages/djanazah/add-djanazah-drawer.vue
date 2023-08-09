<script lang="ts">
import { Prayer } from '@/views/shared/prayer';
import DjanazahController from '@api/controller/djanazah/djanazah-controller';
import { Component, Prop, Vue } from 'vue-facing-decorator';
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';
import DjanazahDrawerEmit from './djanazah-drawer-emit';

// non-state variables
const djanazahController: DjanazahController = new DjanazahController();

@Component({
    components: {
        PerfectScrollbar
    }
})
export default class AddDjanazahDrawer extends Vue {

    @Prop() isDrawerOpen: boolean = false
    readonly prayers: string[] = Object.values(Prayer)
    isFormValid: boolean = false
    fullName: string = ""
    date: string = ""
    after: Prayer = Prayer.DOHR;
    photo: string = ""

    defaultValidator(value: string): true | string {
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
        djanazahController.addDjanazah(this.fullName, this.date, this.after, this.photo)
        .then(() => {
            this.emitDrawerValue({ visible: false, reload: true })
        })
        .catch((error) => {
            console.log(error)
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
7
<template>
    <VNavigationDrawer
        temporary
        width="400"
        location="end"
        class="scrollabe-content"
        :model-value="isDrawerOpen"
        @update:model-value="cancelDrawer">

        <AppDrawerHeaderSection title="Nieuw djanazah gebed" @cancel="cancelDrawer(false)"/>

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
