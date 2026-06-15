import { iconClass, WEATHER_ICON } from './iconHelpers'

export const Icon = ({ name, className = '', title, fallback, ...props }) => (
    <i
        className={`bi ${iconClass(name, fallback)}${className ? ` ${className}` : ''}`}
        aria-hidden={title ? undefined : true}
        title={title}
        {...props}
    />
)

export const WeatherIcon = ({ icon, className = '', ...props }) => (
    <Icon name={icon} fallback={WEATHER_ICON} className={className} {...props} />
)
