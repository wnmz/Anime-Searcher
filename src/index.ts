import 'dotenv/config';
import { Searcher } from './modules/searcher/searcher';

const image_url =
  'https://media.discordapp.net/attachments/861542336679903252/1119532222450507776/image.png?width=365&height=277';
const searcher = new Searcher({
  disabled_providers: [],
});

const main = async () => {
  const result = await searcher.search(image_url);
  console.dir(result);
};

main();
