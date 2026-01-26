import { Link } from "react-router-dom";
import {
  FiShoppingBag,
  FiAlertCircle,
  FiInbox,
} from "react-icons/fi";

export default function EmptyState({
  type = "empty",
  title,
  description,
  actionText,
  actionLink = "/",
}) {
  const icons = {
    empty: <FiInbox className="text-5xl text-white/40" />,
    error: <FiAlertCircle className="text-5xl text-red-400" />,
    products: <FiShoppingBag className="text-5xl text-primary" />,
  };

  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-4">
      <div className="mb-6">{icons[type]}</div>

      <h2 className="text-2xl font-semibold mb-2">
        {title}
      </h2>

      <p className="text-white/60 max-w-md mb-6">
        {description}
      </p>

      {actionText && (
        <Link
          to={actionLink}
          className="px-6 py-3 rounded-xl bg-primary shadow-glow hover:opacity-90 transition"
        >
          {actionText}
        </Link>
      )}
    </div>
  );
}
