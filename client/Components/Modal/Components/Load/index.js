import Loading from '@Components/Loading';
import { FullPageLoading } from '@Components/Loading/FullPageLoading';
import { useState } from 'react';
import { ToastContainer } from 'react-toastify';

function LoadContainer({
  files,
  cb,
  folder,
}) {

  const [loaded, setLoaded] = useState(0);

  return (
    <>
      <ToastContainer pauseOnFocusLoss={false} />
      {(loaded && (
        <>
          <Loading width={loaded} />
          <FullPageLoading />
        </>
      )) ||
        null}
    </>
  );
}

export default LoadContainer;
