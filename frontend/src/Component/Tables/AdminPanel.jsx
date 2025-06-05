import AdminTable from './TableSubComponents/Admin/AdminTable';

const AdminPanel = () => {
  return (
    <>
      <div className="p-4">
        <section
          className={
            'relative overflow-x-auto mx-4 rounded-lg border shadow-sm '
          }
        >
          {' '}
          <AdminTable />
        </section>
      </div>
    </>
  );
};

export default AdminPanel;
