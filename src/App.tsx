import { Shell } from './components/Shell';
import { Cancellation } from './pages/Cancellation';
import { Hub } from './pages/Hub';
import { useStore } from './store';

export function App() {
  const route = useStore((s) => s.route);
  return <Shell>{route === 'hub' ? <Hub /> : <Cancellation />}</Shell>;
}
