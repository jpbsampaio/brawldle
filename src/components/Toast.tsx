import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";

interface ToastProps {
  visible: boolean;
  message: string;
  type: "error" | "success" | "warning";
  onClose: () => void;
}

export function Toast({ visible, message, type, onClose }: ToastProps) {
  if (!visible) return null;

  return (
    <div
      className={`fixed top-4 right-4 left-4 md:left-auto md:w-80 z-50 transform transition-all duration-300 ${
        visible
          ? "translate-y-0 opacity-100"
          : "-translate-y-4 opacity-0"
      }`}
    >
      <Card
        className={`
          shadow-lg border-0
          ${type === "error" ? "bg-red-500" : ""}
          ${type === "success" ? "bg-green-500" : ""}
          ${type === "warning" ? "bg-yellow-500" : ""}
        `}
      >
        <CardContent className="p-4 flex items-center gap-3">
          {type === "error" && (
            <div className="rounded-full bg-white/20 p-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
            </div>
          )}
          <p className="text-white font-medium flex-1">{message}</p>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-full text-white/80 hover:text-white hover:bg-white/20"
            onClick={onClose}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}