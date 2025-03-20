export default function () {
  /**
   * Gets or creates a unique user ID to be used for Optimizely experiments.
   * @see: https://docs.developers.optimizely.com/full-stack-experimentation/docs/handle-user-ids
   */
  const cookie = useCookie('optimizely-user-id', {
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365 * 2, // 2 years
    default: () => crypto.randomUUID(),
  })

  return cookie
}
