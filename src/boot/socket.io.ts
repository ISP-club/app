import { boot } from 'quasar/wrappers';
import VueSocketIO from 'vue-3-socket.io'
import SocketIO from 'socket.io-client'

const url = process.env.API_URL as string;
const socket = SocketIO(url);

export default boot(({ app, store }) => {
  app.use(
    new VueSocketIO({
      debug: false,
      connection: socket,
      vuex: {
        store,
        actionPrefix: 'SOCKET_',
        mutationPrefix: 'SOCKET_'
      }
    })
  );
});

export { socket };
