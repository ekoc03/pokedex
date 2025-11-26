import { TYPE_COLORS } from '../types/pokemon';

export const getTypeColor = (type: string): { bg: string; text: string; gradient: string } => {
  const normalizedType = type.toLowerCase();
  return TYPE_COLORS[normalizedType] || {
    bg: 'bg-gray-400',
    text: 'text-gray-800',
    gradient: 'from-gray-400 to-gray-300'
  };
};

export const getTypeGradientClass = (type: string): string => {
  const colors = getTypeColor(type);
  return `bg-gradient-to-br ${colors.gradient}`;
};

export const getTypeBadgeClasses = (type: string): string => {
  const colors = getTypeColor(type);
  return `${colors.bg} ${colors.text}`;
};
