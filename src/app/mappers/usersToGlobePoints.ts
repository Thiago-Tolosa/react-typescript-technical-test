import type { GlobePoint } from '../../features/globe'
import type { User } from '../../features/users'

/** Ponte entre as duas features: elas não se conhecem, o app as conecta. */
export function usersToGlobePoints(users: User[]): GlobePoint[] {
  return users.map((user) => ({
    id: user.id,
    lat: Number(user.address.geo.lat),
    lng: Number(user.address.geo.lng),
  }))
}
