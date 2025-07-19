import TabBar from './components/TabBar.js';
import Content from './components/Content.js';
import { request } from './components/api.js';

export default function App($app) {
  this.state = {
    currentTab: window.location.pathname.replace('/', '') || 'all',
    photos: [],
  };
  const tabBar = new TabBar({
    $app,
    initialState: '',
    onClick: async (name) => {
      history.pushState(null, `${name} 사진`, name);
      this.setState({
        ...this.state,
        currentTab: name,
        photos: await request(name === 'all' ? '' : name),
      });
    },
  });
  const content = new Content({
    $app,
    initialState: [],
  });

  this.setState = (newState) => {
    this.state = newState;
    tabBar.setState(this.state.currentTab);
    content.setState(this.state.photos);
  };

  window.addEventListener('popstate', async () => {
    const tabName = window.location.pathname.replace('/', '') || 'all';
    const photos = await request(tabName === 'all' ? '' : tabName);

    this.setState({
      ...this.state,
      currentTab: tabName,
      photos: photos,
    });
  });

  const init = async () => {
    try {
      const currentTab = this.state.currentTab;
      const initialPhotos = await request(
        currentTab === 'all' ? '' : currentTab
      );
      this.setState({
        ...this.state,
        photos: initialPhotos,
      });
    } catch (err) {
      console.log(err);
    }
  };

  init();
}
