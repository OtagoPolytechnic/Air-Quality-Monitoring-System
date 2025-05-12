const TableItem = ({ item, className }) => {
  return (
    <td className={`${className} pl-1 py-2 text-gray-900`}>
      {item}
    </td>
  );
};

export default TableItem;