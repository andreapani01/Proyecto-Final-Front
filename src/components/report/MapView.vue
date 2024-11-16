<template>
  <div id="map" style="height: 500px; width: 100%"></div>
  {{ currentPosition }}
</template>

<script>
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default {
  name: "MapView",
  emits: ["update-location"], // Declarar el evento personalizado
  mounted() {
    this.map = L.map("map").setView([0, 0], 2);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '© <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    }).addTo(this.map);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          this.map.setView([latitude, longitude], 13);
          const marker = L.marker([latitude, longitude], { draggable: true })
            .addTo(this.map)
            .bindPopup("Arrástrame para cambiar la posición.")
            .openPopup();

          this.currentPosition = { lat: latitude, lng: longitude };

          // Emitir la posición inicial
          this.$emit("update-location", this.currentPosition);

          // Actualizar la posición al arrastrar el marcador
          marker.on("dragend", (event) => {
            const newPosition = event.target.getLatLng();
            this.currentPosition = {
              lat: newPosition.lat,
              lng: newPosition.lng,
            };

            // Emitir la nueva posición
            this.$emit("update-location", this.currentPosition);
          });
        },
        (error) => {
          console.error("Error al obtener la geolocalización:", error.message);
          alert("No se pudo obtener la geolocalización.");
        }
      );
    } else {
      alert("Tu navegador no soporta geolocalización.");
    }
  },
  data() {
    return {
      map: null,
      currentPosition: { lat: 0, lng: 0 },
    };
  },
};
</script>

<style>
#map {
  height: 100%;
  width: 100%;
}
</style>
