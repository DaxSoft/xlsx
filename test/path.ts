import { PathRoute } from '@vorlefan/path'

const TestRoute: PathRoute = new PathRoute()
TestRoute.set('main', TestRoute.resolve(__dirname, '..'))

export { TestRoute }
