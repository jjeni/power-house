type AvatarProps = {
  photoURL?: string;
  author?: string;
};

export default function Avatar({ photoURL, author }: AvatarProps) {
  const initials = author?.charAt(0).toUpperCase() || "?";

  return (
    <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-primary text-white font-bold flex items-center justify-center">
      {photoURL ? (
        <img
          src={photoURL}
          alt="profile"
          className="w-full h-full object-cover"
          onError={(e) => {
            // if broken, hide image and fallback to initials
            e.currentTarget.style.display = "none";
            e.currentTarget.insertAdjacentHTML(
              "afterend",
              `<span class='flex items-center justify-center w-full h-full'>${initials}</span>`
            );
          }}
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}
