<template>
  <h5 class="frm-title">Formulario de publicación de reporte</h5>
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
    <q-card-section class="sections">
      <q-input
        v-model="issueDetail"
        outlined
        clearable
        type="textarea"
        color=""
        label="Descripción"
        :shadow-text="textareaShadowText"
        @keydown="processTextareaFill"
        @focus="processTextareaFill"
        class="textarea-box"
      />
    </q-card-section>
    <q-card-section class="sections">
      <div class="map-container">
        <MapView
          @update-location="
            (nuevaPosición) => (geoLocalización = nuevaPosición)
          "
        />
      </div>
    </q-card-section>
    <q-card-section class="sections">
      <q-btn label="Publicar" color="primary" @click="registerReport" />
    </q-card-section>
  </div>
</template>

<style>
.frm-title {
  margin: 0;
}
.frm-publish {
  /*justify-content: space-between;*/
}

.sections {
  display: flex;
  flex-wrap: wrap;
  padding: 5px;
}

.input-box {
  height: 52px;
  margin: 18px 15px 18px 0px;
  width: 300px;
}

.textarea-box {
  width: 95%;
}

.map-container {
  width: 400px;
  height: 200px;
}

@media (max-width: 600px) {
  .input-box {
    width: 100%;
    margin: 8px 0;
  }

  .textarea-box {
    width: 100%;
  }

  .map-container {
    width: 100%;
    height: 300px;
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
