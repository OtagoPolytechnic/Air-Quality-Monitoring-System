const TableItem = ({ item, className }) => {
  return (
    <td className={`${className} pl-2 py-2 text-gray-900`}>
      {item}
    </td>
  );
};

export default TableItem;