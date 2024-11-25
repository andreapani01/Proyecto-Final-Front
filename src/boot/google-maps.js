import { boot } from "quasar/wrappers";
import VueGoogleMaps from "@fawmi/vue-google-maps";

export default boot(({ app }) => {
  app.use(VueGoogleMaps, {
    load: {
      key: "AIzaSyCGTlQwb_dpzNvUHK8OOmv7ITio91IluMo",
    },
  });
});
