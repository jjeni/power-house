import * as React from "react"
import { Input } from "@/components/ui/input"
import FireLogo from "@/pages/Svg"
interface HubFilterProps {
  searchQuery: string
  setSearchQuery: (val: string) => void
  activeTab: string
  setActiveTab: (tab: string) => void
}

export const HubFilter: React.FC<HubFilterProps> = ({
  searchQuery,
  setSearchQuery,
  activeTab,
  setActiveTab,
}) => {
  const tabs = ["all", "tools", "ideas", "top"]

  return (
    <div className="mx-auto mt-5 px-4 py-3 flex flex-col gap-4">
  {/* Tabs + Search in same row on larger screens */}
  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
    {/* Tabs */}
    <div className="flex gap-2 sm:gap-3 md:gap-5 lg:gap-8">
      {tabs.map((tab, index) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`px-4 py-2 text-sm font-bold transition-all duration-200 uppercase ${
            activeTab === tab
              ? "border border-[#A66EFF]/60 text-white rounded-md"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50 hover:rounded-md"
          }`}
        >
          {tab}
          {index === tabs.length-1 && (
            <img src="Vector.svg" alt="logo" className="w-3 ml-2 mb-1 inline-block"/>
          )}
        </button>
      ))}
    </div>

    {/* Search Bar */}
    <div className="relative w-full sm:w-72 md:w-96">
      <Input
        type="text"
        placeholder="Search posts by title, description, or tags..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full pl-10 pr-4 py-2 bg-transparent border border-b border-[#A66EFF]/30 placeholder:font-medium placeholder:text-muted-foreground"
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
        />
      </svg>
    </div>
  </div>
</div>

  )
}
