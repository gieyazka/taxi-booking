import Style from "../styles/table.module.css";

export const KyTable = ({ columns, data }: { data: any[]; columns: any[] }) => {
  console.log( (data.length/10));

  return (
    <div className={Style.tscroll}>
      <table>
        <thead>
          <tr>
            <th></th>
            <th colSpan={5}>Heading 1</th>
            <th colSpan={8}>Heading 2</th>
            <th colSpan={4}>Heading 3</th>
          </tr>
        </thead>
        <tbody>
          {data.map((v, i) => (
            <tr key={v.id}>
              <td>{v.id}</td>
              <td>AAA</td>
              <td>BBB</td>
              <td>CCC</td>
              <td>DDD</td>
              <td>EEE</td>
              <td>FFF</td>
              <td>GGG</td>
              <td>HHH</td>
              <td>III</td>
              <td>JJJ</td>
              <td>KKK</td>
              <td>LLL</td>
              <td>MMM</td>
              <td>NNN</td>
              <td>OOO</td>
              <td>PPP</td>
              <td>QQQ</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

function data(data: any) {
  throw new Error("Function not implemented.");
}
