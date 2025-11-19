from fastapi.exceptions import RequestValidationError


class FieldValidationError(RequestValidationError):

    def __init__(self, field: str, message: str):
        super().__init__([
            {
                "loc": ("body", field),
                "msg": message,
                "type": "value_error"
            }
        ])
        self.field = field
        self.message = message
