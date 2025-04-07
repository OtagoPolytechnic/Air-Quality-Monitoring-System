import React from 'react';
import TableButton from './TableSubComponents/TableButton';
import OverviewTable from './TableSubComponents/Overview/OverviewTable';
import useModal from '../../Hooks/Modal/useModal';

const OverviewPanel = () => {
  const { modal, setModal } = useModal();

  return (
    <>
       {/* Do we really need this?  */}
      <TableButton text={'Refresh Data'} onClick={() => window.location.reload()} />
      <section className={'relative overflow-x-auto w-4/5 mx-auto rounded-lg border shadow-sm mb-4'}>
        <OverviewTable />
      </section>
    </>
  );
};

export default OverviewPanel;