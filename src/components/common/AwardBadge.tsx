import React from 'react';
import { AwardLevelType } from '../../types';
import { AWARD_LEVELS } from '../../lib/constants';
import { Globe, Trophy, Medal, Award as AwardIcon, Sparkles, Bookmark } from 'lucide-react';

interface AwardBadgeProps {
  level: AwardLevelType;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const AwardBadge: React.FC<AwardBadgeProps> = ({
  level,
  size = 'sm',
  showIcon = true
}) => {
  const levelInfo = AWARD_LEVELS.find(l => l.id === level) || AWARD_LEVELS[5];

  const getIcon = () => {
    const iconSize = size === 'xs' ? 10 : size === 'sm' ? 12 : size === 'lg' ? 16 : 14;
    switch (level) {
      case 'international':
        return <Globe size={iconSize} className="animate-pulse" />;
      case 'national':
        return <Trophy size={iconSize} />;
      case 'regional':
        return <Medal size={iconSize} />;
      case 'provincial':
        return <AwardIcon size={iconSize} />;
      case 'area':
        return <Sparkles size={iconSize} />;
      default:
        return <Bookmark size={iconSize} />;
    }
  };

  const sizeClasses = {
    xs: 'px-2 py-0.5 text-[10px] gap-1',
    sm: 'px-2.5 py-1 text-xs gap-1.5',
    md: 'px-3 py-1.5 text-xs gap-1.5',
    lg: 'px-4 py-2 text-sm gap-2 font-semibold'
  };

  return (
    <span
      className={`inline-flex items-center rounded-full tracking-wide shadow-xs ${levelInfo.badgeClass} ${sizeClasses[size]}`}
    >
      {showIcon && getIcon()}
      <span>{levelInfo.nameTh}</span>
    </span>
  );
};
