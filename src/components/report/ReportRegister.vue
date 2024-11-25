<template>
  <h5 class="frm-title">Formulario de publicación de reporte</h5>
  <div class="frm-publish">
    <q-card-section class="sections">
      <q-select
        outlined
        v-model="typeSelected"
        :options="typesDomain"
        option-label="label"
        option-value="value"
        label="Categoría"
        class="input-box"
        emit-value
      />
      <q-input
        outlined
        v-model="reportTitle"
        label="Asunto"
        class="input-box"
      />
    </q-card-section>
    <q-card-section class="sections">
      <q-input
        v-model="reportDetail"
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
        <p>Coordenadas del marker: {{ geoLocation }}</p>
        <MapWithMarker @update-location="updateGeoLocation" />
      </div>
    </q-card-section>
    <q-card-section class="sections">
      <q-btn label="Publicar" color="primary" @click="registerReport" />
    </q-card-section>
  </div>
</template>

<style>
.frm-title {
  margin: 5px 0px;
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
  width: 90%;
  height: 400px;
  padding: 0px;
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
import MapWithMarker from "src/components/report/MapWithMarker.vue";

export default {
  name: "ReportRegister",
  components: {
    MapWithMarker,
  },
  data() {
    return {
      geoLocation: null,
      reportTitle: null,
      reportDetail: null,
      typeSelected: null,
      typesDomain: [
        { label: "Ambiental", value: "AMB" },
        { label: "Delictivo", value: "DEL" },
      ],
    };
  },
  methods: {
    updateGeoLocation(newCoords) {
      this.geoLocation = newCoords;
    },
    registerReport() {
      let endpointPublishReport = "/api/Report/AddReport";

      const geoLocationString = this.geoLocation
        ? `${this.geoLocation.lat}, ${this.geoLocation.lng}`
        : null;

      let report = {
        userId: "1",
        title: this.reportTitle,
        detail: this.reportDetail,
        type: this.typeSelected,
        location: geoLocationString,
      };

      this.$api
        .post(endpointPublishReport, report, {
          headers: {
            "Content-Type": "application/json",
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
};
</script>
