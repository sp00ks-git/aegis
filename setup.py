
import subprocess
import os
import sys

def print_color(text, color):
    """Prints text in a given color."""
    colors = {
        "header": "\033[95m",
        "blue": "\033[94m",
        "green": "\033[92m",
        "yellow": "\033[93m",
        "red": "\033[91m",
        "endc": "\033[0m",
    }
    sys.stdout.write(colors.get(color, "") + text + colors["endc"] + "\n")

def run_command(command, cwd, error_message):
    """Runs a command in a subprocess and handles errors."""
    try:
        print_color(f"Running: {' '.join(command)} in {cwd}", "blue")
        subprocess.run(command, check=True, cwd=cwd, stdout=sys.stdout, stderr=sys.stderr)
        return True
    except (subprocess.CalledProcessError, FileNotFoundError) as e:
        print_color(f"Error: {error_message}", "red")
        print_color(str(e), "red")
        return False

def setup_backend():
    """Sets up the Python backend."""
    print_color("\n--- Setting up Backend ---", "header")
    backend_dir = os.path.join(os.path.dirname(__file__), "backend")

    # Create virtual environment
    if not run_command([sys.executable, "-m", "venv", "venv"], backend_dir, "Failed to create virtual environment."):
        return False

    # Determine pip path
    pip_executable = os.path.join(backend_dir, "venv", "bin", "pip")
    if sys.platform == "win32":
        pip_executable = os.path.join(backend_dir, "venv", "Scripts", "pip.exe")

    # Install requirements
    if not run_command([pip_executable, "install", "-r", "requirements.txt"], backend_dir, "Failed to install Python dependencies."):
        return False

    print_color("Backend setup successful!", "green")
    return True

def setup_frontend():
    """Sets up the Node.js frontend."""
    print_color("\n--- Setting up Frontend ---", "header")
    frontend_dir = os.path.join(os.path.dirname(__file__), "frontend")

    if not run_command(["npm", "install"], frontend_dir, "Failed to install Node.js dependencies. Please ensure Node.js and npm are installed."):
        return False

    print_color("Frontend setup successful!", "green")
    return True

def main():
    """Main function to run the setup."""
    if os.geteuid() == 0:
        print_color("Warning: Running this script with sudo is not recommended.", "yellow")
        print_color("It's better to run it as a regular user.", "yellow")

    if not setup_backend():
        sys.exit(1)

    if not setup_frontend():
        sys.exit(1)

    print_color("\n🎉 Installation Complete! 🎉", "header")
    print_color("To start the application, you need to run two commands in separate terminals:", "yellow")
    print_color("\n1. Start the Backend Server:", "blue")
    print("   cd backend")
    if sys.platform == "win32":
        print("   .\\venv\\Scripts\\activate")
    else:
        print("   source ./venv/bin/activate")
    print("   uvicorn main:app --host 0.0.0.0 --port 8000")

    print_color("\n2. Start the Frontend Server:", "blue")
    print("   cd frontend")
    print("   npm start")

if __name__ == "__main__":
    main()
