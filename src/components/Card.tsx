type CardProps = {
  title: string;
  value: string;
  color?: string;
  icon?: React.ReactNode;
};

export default function Card({ title, value, color = "bg-gray-100", icon }: CardProps) {
  return (
    <div
      className={`${color} p-6 rounded-lg shadow-md text-center transition hover:shadow-lg`}
    >
      <div className="flex justify-center items-center gap-2 mb-2">
        {icon}
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
