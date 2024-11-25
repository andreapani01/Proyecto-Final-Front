<template>
  <div>
    <GMapMap :center="mapCenter" :zoom="15" style="width: 100%; height: 350px">
      <GMapMarker
        :position="mapCenter"
        :clickable="true"
        :draggable="true"
        @dragend="onMarkerDragEnd"
      />
    </GMapMap>
  </div>
</template>

<script>
export default {
  data() {
    return {
      mapCenter: { lat: -12.0464, lng: -77.0428 }, // Coordenadas iniciales (Lima, Perú)
    };
  },
  mounted() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.mapCenter = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
      },
      (error) => {
        console.error("Error al obtener la ubicación: ", error);
      }
    );
    this.$emit("update-location", this.mapCenter);
  },
  methods: {
    onMarkerDragEnd(event) {
      const newCoords = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };

      this.mapCenter = newCoords;
      this.$emit("update-location", newCoords);
    },
  },
};
</script>

<style scoped>
/* Puedes añadir estilos adicionales si lo necesitas */
</style>
