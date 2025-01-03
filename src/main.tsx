import ReactDOM from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async';
import Layout from './components/layouts/layout.tsx';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <BrowserRouter>
  <HelmetProvider>
  {/* <React.StrictMode> */}
   <Layout>
    </Layout> 
  {/* </React.StrictMode> */}
  </HelmetProvider>
  </BrowserRouter>
)
