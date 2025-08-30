import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "./ui/badge";
import { MessageCircle } from "lucide-react";

type Post = {
  id: string;
  author: string;
  photoURL?: string;
  createdAt: any;
  title: string;
  description: string;
  tags: string[];
  type: string;
  likedBy?: string[];
  comments: any[];
};

const formatDate = (date: any) => {
  if (!date) return "";

  if (date?.toDate) {
    date = date.toDate();
  }
  if (typeof date === "string") {
    date = new Date(date);
  }
  if (!(date instanceof Date) || isNaN(date.getTime())) return "";

  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  if (isToday) {
    return `Today, ${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  }
  if (isYesterday) {
    return `Yesterday, ${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  }

  return date.toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

interface PostGridProps {
    posts :Post[],
    getTypeColor: (type: string) => string;
    onSelectPost: (id: string) => void;
}

function PostsGrid({
    posts, 
    getTypeColor,
    onSelectPost,
}: PostGridProps){
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Card
                key={post.id}
                className="bg-[#A66EFF]/5 border-white/10 hover:shadow-glow hover:scale-[1.02] transition-all duration-300 cursor-pointer flex flex-col h-full"
                onClick={() => onSelectPost(post.id)}
              >
                {/* Header */}
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-xs">
                        <img
                          src={post.photoURL || "/default-avatar.png"}
                          alt="profile"
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-sm">
                          {post.author}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(post.createdAt)}
                        </p>
                      </div>
                    </div>
                    <Badge
                      className={`text-xs border ${getTypeColor(post.type)}`}
                    >
                      {post.type}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg font-semibold text-foreground leading-tight break-words whitespace-pre-wrap">
                    {post.title}
                  </CardTitle>
                </CardHeader>

                {/* Content */}
                <CardContent className="pt-0 flex-1">
                  <p className="text-muted-foreground text-sm mb-3 line-clamp-2 break-words">
                    {post.description.substring(0, 100)}...
                  </p>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {post.tags.slice(0, 3).map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="text-xs bg-primary/10 text-primary border-primary/20 px-2 py-0.5"
                      >
                        #{tag}
                      </Badge>
                    ))}
                    {post.tags.length > 3 && (
                      <Badge
                        variant="secondary"
                        className="text-xs bg-muted/20 text-muted-foreground border-muted/30 px-2 py-0.5"
                      >
                        +{post.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                </CardContent>

                {/* Footer (always at bottom, only 1 border) */}
                <CardFooter className="flex items-center gap-4 pt-2 border-t border-white/10 mt-auto">
                  <div className="flex items-center gap-1 text-muted-foreground text-sm">
                    <img src="fire.svg" className="w-3 h-3" />
                    {post.likedBy?.length || 0}
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground text-sm">
                    <MessageCircle className="w-3 h-3" />
                    {post.comments.length}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>

    );
}

export default PostsGrid;