export const ApplicationException = ({message = "error",
    options = {cause: { status: 400 }}} = {}) => {throw new Error(message, options)}

export const ConflictException = (message = "conflict", issues={}) => {
    return ApplicationException({message,options: {cause: { status: 409, ...issues}}})}

export const NotfoundException= (message = "Notfound", issue = {}) => {
    return ApplicationException({message,options: {cause: { status: 404, ...issue }}})}

export const BadException = (message = "Bad Request", issue = {}) => {
    return ApplicationException({message,options: {cause: { status: 400, ...issue }}})}

export const UnauthorizedException = (message = "Unauthorized", issue ={}) => {
    return ApplicationException({message,options: {cause:{status:401,...issue}}})}

export const ForbiddenException = (message = "Forbidden", issue = {}) => {
    return ApplicationException({message,options: {cause: { status: 403, ...issue }}})}

export const TooManyRequestException= (
    message = "Too Many Request Exception",
    issues = undefined
)=>{
    return ApplicationException({ message, status: 429, issues })
}