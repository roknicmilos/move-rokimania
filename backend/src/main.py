from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from decouple import config, Csv
from src.tracker import routes as tracker_routes
from src.users import routes as user_routes
from .schemas import MessageResponse

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=config("CORS_ALLOWED_ORIGINS", cast=Csv()),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(tracker_routes.router)
app.include_router(user_routes.router)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(
    request: Request, exc: RequestValidationError
) -> JSONResponse:
    errors = {}
    for error in exc.errors():
        field_name = error["loc"][-1]
        error_msg = error["msg"]
        if error_msg.startswith("Value error, "):
            error_msg = error_msg[13:]
        if field_name not in errors:
            errors[field_name] = []
        errors[field_name].append(error_msg)

    return JSONResponse(status_code=400, content={"errors": errors})


@app.get("/", response_model=MessageResponse)
def index() -> dict[str, str]:
    return {"message": "Welcome to the Workout Tracker API"}
