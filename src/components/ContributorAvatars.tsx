interface ContributorAvatarsProps {
  contributors: string[];
}

export const ContributorAvatars = ({ contributors }: ContributorAvatarsProps) => {
  const avatarColors = [
    "bg-gradient-to-br from-purple-500 to-pink-500",
    "bg-gradient-to-br from-blue-500 to-cyan-500", 
    "bg-gradient-to-br from-green-500 to-emerald-500",
    "bg-gradient-to-br from-orange-500 to-red-500",
    "bg-gradient-to-br from-indigo-500 to-purple-500"
  ];

  return (
    <div className="flex items-center space-x-2">
      <span className="text-xs text-muted-foreground">Contributors:</span>
      <div className="flex -space-x-2">
        {contributors.slice(0, 4).map((contributor, index) => (
          <div
            key={contributor}
            className={`w-8 h-8 rounded-full border-2 border-background flex items-center justify-center text-white text-xs font-medium ${
              avatarColors[index % avatarColors.length]
            }`}
            title={contributor}
          >
            {contributor.charAt(0).toUpperCase()}
          </div>
        ))}
        {contributors.length > 4 && (
          <div className="w-8 h-8 rounded-full border-2 border-background bg-muted flex items-center justify-center text-muted-foreground text-xs font-medium">
            +{contributors.length - 4}
          </div>
        )}
      </div>
    </div>
  );
};