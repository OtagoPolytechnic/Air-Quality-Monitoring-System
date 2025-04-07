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
      <section className={'relative overflow-x-auto mx-4 rounded-lg border shadow-sm'}>
        <OverviewTable />
      </section>
    </>
  );
};

export default OverviewPanel;