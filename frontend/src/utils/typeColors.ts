import { TYPE_COLORS } from '../types/pokemon';

const getTypeColor = (type: string): { bg: string; text: string; } => {
  const normalizedType = type.toLowerCase();
  return TYPE_COLORS[normalizedType] || {
    bg: 'bg-gray-400',
    text: 'text-gray-800',
  };
};

export const getTypeBadgeClasses = (type: string): string => {
  const colors = getTypeColor(type);
  return `${colors.bg} ${colors.text}`;
};
