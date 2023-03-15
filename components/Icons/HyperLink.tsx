type IconProps = {
  size?: number | string;
  className?: string;
};
export default function HyperLink({ size = 16, className }: IconProps) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill="none"
    >
      <path
        fill="currentFill"
        d="M8.86 6.193 6.193 8.86a.667.667 0 0 0 .217 1.093.667.667 0 0 0 .73-.146L9.807 7.14a.67.67 0 1 0-.947-.947Z"
      />
      <path
        fill="currentFill"
        d="m8.186 11.6-.854.847a2.8 2.8 0 0 1-3.72.266 2.667 2.667 0 0 1-.18-3.953l.947-.953a.667.667 0 0 0-.217-1.093.667.667 0 0 0-.73.146l-.846.853a4.1 4.1 0 0 0-.447 5.38 4.04 4.04 0 0 0 6.047.4l.946-.946a.67.67 0 1 0-.946-.947ZM13.107 2.147a4.12 4.12 0 0 0-5.42.453l-.72.733a.726.726 0 0 0-.113 1.074.667.667 0 0 0 .947 0l.866-.874a2.78 2.78 0 0 1 3.714-.266 2.668 2.668 0 0 1 .18 3.966l-.947.954a.666.666 0 0 0 0 .946.667.667 0 0 0 .947 0l.946-.946a4.04 4.04 0 0 0-.4-6.04Z"
      />
    </svg>
  );
}
