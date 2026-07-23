import React from 'react';
import {
  Sun,
  Moon,
  SunMedium,
  MoonStar,
  CloudSun,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudRainWind,
  CloudHail,
  Snowflake,
  CloudSnow,
  CloudLightning,
  Wind,
  Umbrella,
  Shirt,
  Smile,
  Glasses,
  Thermometer,
  Droplets,
  Eye,
  Compass as CompassIcon,
  LucideProps,
} from 'lucide-react';

interface WeatherIconProps extends LucideProps {
  name: string;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ name, className = 'w-6 h-6', ...props }) => {
  switch (name) {
    case 'Sun':
      return <Sun className={className} {...props} />;
    case 'Moon':
      return <Moon className={className} {...props} />;
    case 'SunMedium':
      return <SunMedium className={className} {...props} />;
    case 'MoonStar':
      return <MoonStar className={className} {...props} />;
    case 'CloudSun':
      return <CloudSun className={className} {...props} />;
    case 'Cloud':
      return <Cloud className={className} {...props} />;
    case 'CloudFog':
      return <CloudFog className={className} {...props} />;
    case 'CloudDrizzle':
      return <CloudDrizzle className={className} {...props} />;
    case 'CloudRain':
      return <CloudRain className={className} {...props} />;
    case 'CloudRainWind':
      return <CloudRainWind className={className} {...props} />;
    case 'CloudHail':
      return <CloudHail className={className} {...props} />;
    case 'Snowflake':
      return <Snowflake className={className} {...props} />;
    case 'CloudSnow':
      return <CloudSnow className={className} {...props} />;
    case 'CloudLightning':
      return <CloudLightning className={className} {...props} />;
    case 'Wind':
      return <Wind className={className} {...props} />;
    case 'Umbrella':
      return <Umbrella className={className} {...props} />;
    case 'Shirt':
      return <Shirt className={className} {...props} />;
    case 'Smile':
      return <Smile className={className} {...props} />;
    case 'Glasses':
      return <Glasses className={className} {...props} />;
    case 'Thermometer':
      return <Thermometer className={className} {...props} />;
    case 'Droplets':
      return <Droplets className={className} {...props} />;
    case 'Eye':
      return <Eye className={className} {...props} />;
    case 'Compass':
      return <CompassIcon className={className} {...props} />;
    default:
      return <CloudSun className={className} {...props} />;
  }
};
