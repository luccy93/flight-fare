from train_pipeline import run_pipeline
import sys

def main():
    print('=' * 60)
    print('  Flight Fare Prediction - Training Pipeline')
    print('=' * 60)
    try:
        results, best_model = run_pipeline()
        print('\nTraining completed successfully.')
        sys.exit(0)
    except Exception as e:
        print(f'\nTraining failed: {e}')
        sys.exit(1)

if __name__ == '__main__':
    main()
