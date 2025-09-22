type CardProps = {
  title: string;
  value: string;
  color?: string;
};

export default function Card({ title, value, color = "bg-gray-100" }: CardProps) {
  return (
    <div className={`${color} p-6 rounded-lg shadow-md text-center`}>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
