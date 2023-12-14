
import Header from './Header';

function DefaultLayout({ children }) {
  return (
    <div>
      <Header />
      {children}
    </div>
  );
}

export default DefaultLayout;
