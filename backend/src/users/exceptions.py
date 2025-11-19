class UsernameAlreadyExistsError(Exception):
    """Raised when attempting to create a user with an existing username."""

    def __init__(self, message: str = "Username already exists"):
        self.message = message
        super().__init__(self.message)


class InvalidCredentialsError(Exception):
    """Raised when login credentials are invalid."""

    def __init__(self, message: str = "Incorrect username and/or password"):
        self.message = message
        super().__init__(self.message)
