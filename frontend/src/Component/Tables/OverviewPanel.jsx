import React from 'react';
import OverviewTable from './TableSubComponents/Overview/OverviewTable';

const OverviewPanel = ({ blockName }) => {
  return (
    <>
      <section className={'relative overflow-x-auto w-[70%] mx-auto rounded-lg border shadow-sm mb-4'}>
        <OverviewTable blockName={blockName} />
      </section>
    </>
  );
};

export default OverviewPanel;