<template>
  <h5>Formulario de publicación de reporte</h5>
  <div class="frm-publish">
    <q-card-section class="sections">
      <q-select
        outlined
        v-model="model"
        :options="categories"
        label="Categoría"
        class="input-box"
      />
      <q-input outlined v-model="issue" label="Asunto" class="input-box" />
    </q-card-section>
    <q-card-section>
      <q-input
        v-model="issueDetail"
        outlined
        clearable
        type="textarea"
        color=""
        label="Descripción"
        hint="----"
        :shadow-text="textareaShadowText"
        @keydown="processTextareaFill"
        @focus="processTextareaFill"
      />
    </q-card-section>
    <q-card-section>
      <p>prueba: {{ geoLocalización }}</p>
      <MapView
        @update-location="(nuevaPosición) => (geoLocalización = nuevaPosición)"
      />
    </q-card-section>
    <q-card-section>
      <q-btn label="Publicar" color="primary" @click="registerReport" />
    </q-card-section>
  </div>
</template>

<style>
.frm-publish {
  /*justify-content: space-between;*/
}

.sections {
  display: flex;
  flex-wrap: wrap;
}

.input-box {
  height: 52px;
  margin: 18px 15px 18px 0px;
  width: 300px;
}

@media (max-width: 600px) {
  .input-box {
    width: 100%;
    margin: 8px 0;
  }
}
</style>

<script>
import { ref, onMounted } from "vue";
import L, { Draggable } from "leaflet";
import MapView from "src/components/report/MapView.vue";

export default {
  name: "ReportPublish",
  components: {
    MapView,
  },
  data() {
    return {
      geoLocalización: null,
      model: null,
      categories: ["Ambiental", "Delictivo"],
      issue: null,
      issueDetail: null,
    };
  },
  methods: {
    actualizarGeoLocalización(nuevaPosición) {
      this.geoLocalización = nuevaPosición;
    },

    registerReport() {
      let endpointPublishReport = "/api/Reportes";

      // Convertir geoLocalización a string
      const ubicacionString = this.geoLocalización
        ? `${this.geoLocalización.lat}, ${this.geoLocalización.lng}`
        : null;

      let report = {
        usuarioId: "1",
        titulo: this.issue,
        descripcion: this.issueDetail,
        categoria: this.model,
        ubicacion: ubicacionString,
        fechaCreacion: new Date().toISOString(),
        estado: "A",
      };

      console.log("Enviando reporte:", report);

      this.$api
        .post(endpointPublishReport, report, {
          headers: {
            "Content-Type": "application/json", // Encabezado correcto
          },
        })
        .then((response) => {
          // Respuesta exitosa
          console.log("Respuesta exitosa: " + JSON.stringify(response));
          this.$q.notify({
            message: "Reporte publicado exitosamente",
            color: "positive",
            position: "top",
            timeout: 5000,
          });

          this.$router.push("/");
        })
        .catch((error) => {
          // Manejo de errores
          console.error("Error al publicar el reporte:", error);
          this.$q.notify({
            message: "Ocurrió un error al publicar el reporte",
            color: "negative",
            position: "top",
            timeout: 5000,
          });
        });
    },
  },
  return: {
    textareaFillCancelled: ref(false),
    textareaShadowText: ref(null),
    processTextareaFill(e) {
      if (e.keyCode === 27) {
        this.textareaFillCancelled = true;
      } else if (
        e.keyCode === 9 &&
        !this.textareaFillCancelled &&
        this.textareaShadowText.length > 0
      ) {
        e.preventDefault();
        this.issueDetail += this.textareaShadowText;
      } else if (this.textareaFillCancelled) {
        this.textareaFillCancelled = false;
      }
    },
  },
};
</script>
