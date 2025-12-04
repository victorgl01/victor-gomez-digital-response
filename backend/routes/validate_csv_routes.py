from flask import Blueprint, request, jsonify
from services import ValidateCSVService

csv_validation_blueprint = Blueprint('validate_csv', __name__)

@csv_validation_blueprint.route('/validate_csv', methods=['POST'])
def validate_csv():
    data = request.get_json()
    csv_base_64 = data.get('csv_base_64')

    if not csv_base_64:
        return jsonify({"status": "error", "message": "Missing CSV data"}), 400

    service = ValidateCSVService(csv_base_64)
    result = service.process()

    if result["status"] == "error":
        return jsonify(result), 400

    return jsonify(result), 200